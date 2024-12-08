workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        user = person "User"
        ss = softwareSystem "Performance Self-Monitoring" {
            wa = container "Web Application" {
                tags "Web Application"
                technology "TypeScript, Node.js, React"
                description "Provides all of the self-monitoring functionality to users via their web browser"

                server = component "Server" {
                    technology "TypeScript, Node.js, React"
                    description "Prepares and provides HTML on demand, rest of static resources (imgs, CSS, JS etc) and routing"
                }

                group "Pages/Routes" {
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
                }
            }

            api = container "REST API" {
                technology "TypeScript, Node.js"
                description "Provides self-monitoring functionality via JSON/HTTPS"

                server = component "Server" {
                    technology "TypeScript, Node.js, Fastify"
                    description "Provides REST API server for CRUD ops"
                }

                docs = component "Swagger Docs" {
                    technology "Fastify-swagger, OpenAPI"
                    description "Provides REST API docs"

                    user -> this "Reads the documentation" "Web Browser"
                }

                group "CRUD controllers" {
                    contests = component "Contests" {
                        technology "Fastify"
                        description "Provides contests handlers"
                    }

                   settings = component "Settings" {
                        technology "Fastify"
                        description "Provides personalization handlers for a dashboard appearance"
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
        ss.wa.dashboard -> ss.wa.server "Gets HTML and static resources" "HTTP/Stream"
        ss.wa.settings -> ss.wa.server "Gets HTML and static resources" "HTTP/Stream"
        ss.wa.contests -> ss.wa.server "Gets HTML and static resources" "HTTP/Stream"
        ss.wa.server -> ss.api.server "CRUD via REST" "HTTP/JSON"

        // REST API Container
        ss.api.server -> ss.api.contests "Provides contests CRUD ops" "Direct call"
        ss.api.server -> ss.api.settings "Provides settings CRUD ops" "Direct call"
        ss.api.contests -> ss.core.contests "Calls to execute a CRUD request" "HTTP, RPC, Message"
        ss.api.settings -> ss.core.settings "Calls to execute a CRUD request" "HTTP, RPC, Message"

        // Core container
        ss.core.contests -> codewars "Gets contests summary or a contest details" "HTTP/JSON"
        ss.core.contests -> ss.db "CRUD contests progress" "SQL"
        ss.core.settings -> ss.db "CRUD settings" "SQL"
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