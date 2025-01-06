workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        user = person "User"
        ss = softwareSystem "Performance Self-Monitoring" {
            wa = container "Web Application" {
                tags "Web Application"
                technology "TypeScript, Node.js, React"
                description "Provides all of the self-monitoring functionality to users via their web browser"

                group "Routes Providers (Server Side Router)" {
                    dashboard = component "Dashboard" {
                        technology "TypeScript, React"

                        user -> this "Reads any user's performance summary" "Web Browser"
                    }

                    settings = component "Settings" {
                        technology "TypeScript, React"

                        user -> this "Sets up dashboard widgets" "Web Browser"
                    }

                    contests = component "Contests" {
                        technology "TypeScript, React"

                        user -> this "Reads any user's contests statistics or reads/updates its own" "Web Browser/HTML forms"
                    }

                    404 = component "404" {
                        technology "TypeScript, React"
                    }
                }
            }

            api = container "REST API" {
                technology "TypeScript, Node.js"
                description "Provides self-monitoring functionality via JSON/HTTPS"

                docs = component "Swagger Docs" {
                    technology "Fastify-swagger, OpenAPI"
                    description "Provides REST API docs"

                    user -> this "Reads the documentation" "Web Browser"
                }

                group "CRUD controllers (Server)" {
                    contests = component "Contests" {
                        technology "Fastify"
                        description "Provides contests handlers"
                    }

                   settings = component "Settings" {
                        technology "Fastify"
                        description "Provides personalization handlers for a dashboard appearance"
                    }

                   user = component "User" {
                        technology "Fastify"
                        description "Provides handlers for a user's data"
                    }
                }
            }

            core = container "Core" {
                technology "TypeScript"
                description "Contains domain models and business logic"

                contests = component "Contests Service" {
                    description "Validates and executes contest use cases"
                }

                settings = component "Settings Service" {
                    description "Validates and executes settings use cases"
                }

                user = component "User Service" {
                    description "Validates and executes User use cases"
                }
            }

            db = container "Database Schema" {
                tags "Database"
                technology "PostgreSQL"
                description "Stores user information and posted statistics, makes sync and replications"
            }
        }


        group "Contest Platforms" {
            codewars = softwareSystem "Codewars" {
                tags "External System"
            }
        }

        // Web Application Container
        ss.wa.dashboard -> ss.api.settings "CRUD via REST" "HTTP/JSON"
        ss.wa.dashboard -> ss.api.user "CRUD via REST" "HTTP/JSON"
        ss.wa.dashboard -> ss.wa.404 "Asks for 404 content if can't define a dashboard" "Direct Call"

        ss.wa.settings -> ss.api.settings "CRUD via REST" "HTTP/JSON"
        ss.wa.contests -> ss.api.contests "CRUD via REST" "HTTP/JSON"

        // REST API Container

        ss.api.contests -> ss.core.contests "Calls to execute a CRUD request" "HTTP, RPC, AMQP"
        ss.api.settings -> ss.core.settings "Calls to execute a CRUD request" "HTTP, RPC, AMQP"
        ss.api.user -> ss.core.user "Calls to execute a CRUD request" "HTTP, RPC, AMQP"

        // Core container
        ss.core.contests -> codewars "Gets contests summary or a contest details" "HTTP/JSON"
        ss.core.contests -> ss.db "CRUD contests progress" "SQL"
        ss.core.settings -> ss.db "CRUD settings" "SQL"
        ss.core.user -> ss.db "CRUD user data" "SQL"
    }

    views {
        systemContext ss "Diagram1" {
            include *
            autolayout lr
        }

        container ss "Diagram2" {
            include *
            autolayout lr
        }

        component ss.wa "Web_Application_Components" {
            include *
            autoLayout lr
        }

        component ss.api "REST_API_Components" {
            include *
            autoLayout lr
        }

        component ss.core "Core_Components" {
            include *
            autoLayout lr
        }

        dynamic ss.wa {
            title "Reads any users's performance summary: Success Case"
            user -> ss.wa.dashboard "Goes to a user's dashboard page"
            ss.wa.dashboard -> ss.api.user "Checks if requested User exists"
            ss.api.user -> ss.core.user "Checks if requested User exists"
            ss.core.user -> ss.db "Reads the requested user data"
            ss.core.user -> ss.api.user "Returns user data OR null"
            ss.api.user -> ss.wa.dashboard "Response with User data(nullable)"
            ss.wa.dashboard -> ss.api.settings "Asks for User's settings"

            ss.api.settings -> ss.core.settings "Asks for User's settings"
            ss.wa.dashboard -> ss.api.settings "Asks for User's settings"

            ss.api.settings -> ss.wa.dashboard "Provides public settings list"
            ss.wa.dashboard -> user "Provides rendered dashboard"

            autoLayout
        }

        dynamic ss.wa {
            title "Reads any users's performance summary: Undefined user Case"
            user -> ss.wa.dashboard "Goes to a user's dashboard page"
            ss.wa.dashboard -> ss.api.user "Checks if requested User exists"
            ss.api.user -> ss.core.user "Checks if requested User exists"
            ss.core.user -> ss.db "Reads the requested user data"
            ss.core.user -> ss.api.user "Returns NULLISH user data with APP Error code"
            ss.api.user -> ss.wa.dashboard "Returns NULLISH user data with APP Error code"
            ss.wa.dashboard -> ss.wa.404 "Requests for APP Error code description"
            ss.wa.dashboard -> user "Renders meaningful 404 content with APP Error descriptions"

            autoLayout
        }

        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #9b191f
                shape person
            }
            element "Software System" {
                background #ba1e25
            }
            element "Container" {
                background #d9232b
            }
            element "Database" {
                shape cylinder
            }
            element "External System" {
                background #8c8496
                color #ffffff
            }
            element "Web Application" {
                shape WebBrowser
            }
        }
    }

    configuration {
        scope softwaresystem
    }

}